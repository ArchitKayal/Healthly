const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const { Client, ID, Databases } = require("node-appwrite");
require("dotenv").config();

const credentials = require("./creds.json");
const { fitness } = require("googleapis/build/src/apis/fitness");

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.API_KEY);

const database = new Databases(client);

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const secretKey = crypto.randomBytes(32).toString("hex");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual origin of your React app
  })
);

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

let userProfileData;
async function getUserProfile(auth) {
  const service = google.people({ version: "v1", auth });
  const profile = await service.people.get({
    resourceName: "people/me",
    personFields: "names,photos,emailAddresses",
  });

  const displayName = profile.data.names[0].displayName;
  const url = profile.data.photos[0].url;
  let userID = profile.data.resourceName;
  userID = parseInt(userID.replace("people/", ""), 10);
  return {
    displayName,
    profilePhotoUrl: url,
    userID,
  };
}

/*
app.get("/", (req, res) => {
  res.redirect("/auth/google"); // Redirect to the Google authentication route
});
*/
app.get("/auth/google", (req, res) => {
  console.log("hittttt!!!!");

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
  //res.redirect(authUrl);
});

app.get('/get-token', async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      throw new Error('Authorization code not provided');
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.json({ token: tokens.access_token });
  } catch (error) {
    next(error);
  }
});

// Define a route to handle errors
app.get("/error", (req, res) => {
  res.status(500).send("An error occurred");
});

// Callback route for Google OAuth
// Callback route for Google OAuth
app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      throw new Error("Authorization code is missing");
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    const profile = await getUserProfile(oAuth2Client);
    // Save user profile data in the session
    req.session.userProfile = profile;
    userProfileData = profile;

    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.redirect("/error");
  }
});


let isSecondHit = false;


app.get("/fetch-data", async (req, res) => {
  try {
    // Fetch fitness data from Google Fitness API
    const fitness = google.fitness({
      version: "v1",
      auth: oAuth2Client,
    });

    // Access user's name, profile photo, and ID
    const userName = userProfileData.displayName;
    const profilePhoto = userProfileData.profilePhotoUrl;
    const userId = userProfileData.userID;

    const sevenDaysInMillis = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    const startTimeMillis = Date.now() - sevenDaysInMillis; // Start time is 14 days ago
    const endTimeMillis = Date.now(); // End time is the current time

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.blood_glucose" },
          { dataTypeName: "com.google.blood_pressure" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.weight" },
          { dataTypeName: "com.google.height" },
          { dataTypeName: "com.google.sleep.segment" },
          { dataTypeName: "com.google.body.fat.percentage" },
          { dataTypeName: "com.google.menstruation" },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Aggregate data in daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    // Process response to extract formatted data
    const fitnessData = response.data.bucket;
    const formattedData = [];

    fitnessData.forEach((data) => {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedDate = date.toDateString();

      const formattedEntry = {
        date: formattedDate,
        step_count: 0,
        glucose_level: 0,
        blood_pressure: [0, 0],
        heart_rate: 0,
        weight: 0,
        height_in_cms: 0,
        sleep_hours: 0,
        body_fat_in_percent: 0,
        menstrual_cycle_start: "",
      };

      data.dataset.forEach((dataset) => {
        const point = dataset.point;
        if (point && point.length > 0) {
          const value = point[0].value;
          switch (dataset.dataSourceId) {
            case "derived:com.google.step_count.delta:com.google.android.gms:aggregated":
              formattedEntry.step_count = value[0]?.intVal || 0;
              break;
            case "derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated":
              formattedEntry.glucose_level = value[0]?.fpVal * 10 || 0;
              break;
            case "derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated":
              formattedEntry.blood_pressure = [
                value[0]?.fpVal || 0,
                value[1]?.fpVal || 0,
              ];
              break;
            case "derived:com.google.heart_rate.summary:com.google.android.gms:aggregated":
              formattedEntry.heart_rate = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.weight.summary:com.google.android.gms:aggregated":
              formattedEntry.weight = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.height.summary:com.google.android.gms:aggregated":
              formattedEntry.height_in_cms = value[0]?.fpVal * 100 || 0;
              break;
            case "derived:com.google.sleep.segment:com.google.android.gms:merged":
              formattedEntry.sleep_hours = value || 0;
              break;
            case "derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated":
              formattedEntry.body_fat_in_percent = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.menstruation:com.google.android.gms:aggregated":
              formattedEntry.menstrual_cycle_start = value[0]?.intVal || 0;
              break;
            default:
              break;
          }
        }
      });

      formattedData.push(formattedEntry);
    });

    // Create response object with required properties
    const responseData = {
      userName,
      profilePhoto,
      userId,
      formattedData,
    };

    // Send the response
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




const saveUserDataToAppwrite = async (userData) => {
  try {
    const collectionId = process.env.COLLECTION_ID; // Replace with your Appwrite collection ID
    const databaseId = process.env.DATABASE_ID;

    const users = await database.listDocuments(databaseId, collectionId);
    const userExists = users.documents.some(
      (user) => user.profileURL === userData.profilePhoto
    );
    console.log(userExists);
    if (!userExists) {
      const response = await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          username: userData.userName,
          profileURL: userData.profilePhoto,
          userID: userData.userID,
        }
      );
      console.log("Data saved to Appwrite:", response);
    } else {
      console.log("user already exists");
    }
  } catch (error) {
    console.error("Error saving user data to Appwrite:", error);
  }
};

const saveFitnessDataToAppwrite = async (fitnessData) => {
  try {
    const collectionId = process.env.FITNESS_COLLECTION_ID; // Replace with your Appwrite collection ID
    const databaseId = process.env.DATABASE_ID;

    const response = await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        Date: new Date(fitnessData.date),
        stepCount: fitnessData.step_count.toString(),
        Height: fitnessData.height_in_cms,
        Weight: fitnessData.weight,
        menstrualCycle: fitnessData.menstrual_cycle_start.toString(),
        HeartRate: fitnessData.heart_rate,
        glucoseLevel: fitnessData.glucose_level,
        bodyFat: fitnessData.body_fat_in_percent,
        bloodPressure: fitnessData.blood_pressure.toString()
      }
    );
    console.log("Fitness Data saved to Appwrite:", response);
  } catch (error) {
    console.error("Error saving fitness data to Appwrite:", error);
  }
};

app.listen(8000, () => {
  console.log("service listening at 8000");
});
