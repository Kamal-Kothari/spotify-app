import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
/*
    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user information to the request object
    req.user = user;
*/    
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const requireAdmin = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin using email
    const isAdmin = process.env.ADMIN_EMAIL === user.primaryEmailAddress?.emailAddress;
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }


    next();
  } catch (error) {
    console.error("Error in adminRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}