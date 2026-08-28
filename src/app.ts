import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import skillRoutes from "./routes/skill.routes";
import goalRoutes from "./routes/goal.routes";
import userRoutes from "./routes/user.routes";
import learningPathRoutes from "./routes/learningPath.routes";
import resourceRoutes from "./routes/resource.routes";
import topicRoutes from "./routes/topic.routes";
import progressRoutes from "./routes/progress.routes";
import quizRoutes from "./routes/quiz.routes";
import feedbackRoutes from "./routes/feedback.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import analyticsRoutes from "./routes/analytics.routes";
import streakRoutes from "./routes/streak.routes";
import learningInsightsRoutes from "./routes/learning-insights.routes";
import personalizationRoutes from "./routes/personalization.routes";
import adaptiveLearningPathRoutes from "./routes/adaptive-learning-path.routes";
import learningHistoryRoutes
  from "./routes/learning-history.routes";
import topicPrerequisiteRoutes
  from "./routes/topicPrerequisite.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import aiRoutes from "./ai/routes/ai.routes";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Personalized Learning API is running",
  });
});

app.use("/api/users", userRoutes);

app.use("/api/goals", goalRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use(
  "/api/learning-paths",
  learningPathRoutes
);
app.use(
  "/api/recommendations",
  recommendationRoutes
);
app.use(
  "/api/feedback",
  feedbackRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api",
  topicPrerequisiteRoutes
);
app.use(
  "/api/analytics",
  analyticsRoutes
);
app.use(
  "/api/streak",
  streakRoutes
);

app.use(
  "/api/learning-insights",
  learningInsightsRoutes
);

app.use(
  "/api/personalization",
  personalizationRoutes
);

app.use(
  "/api/adaptive-learning-path",
  adaptiveLearningPathRoutes

);
app.use(
  "/api/learning-history",
  learningHistoryRoutes
);
app.use(
  "/api/ai",
  aiRoutes
);
export default app;