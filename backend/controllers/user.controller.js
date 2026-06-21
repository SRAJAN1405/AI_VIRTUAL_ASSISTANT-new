import moment from "moment";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    //agar image url aa rha to thik aur agar wo nhi aa rha to req.file ke andar jo file aa rhi hai usko db me daal do...
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName: assistantName,
        assistantImage: assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      message: "Assistant updated successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating assistant",
      error: error.message,
    });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { promptUser } = req.body;

    if (!promptUser?.trim()) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.history.push(promptUser);
    await user.save();

    const result = await geminiResponse(
      promptUser,
      user.assistantName,
      user.name
    );

    if (!result) {
      return res.status(500).json({
        response: "No response from Gemini.",
      });
    }

    let gemResult;

    try {
      // If Gemini returns pure JSON
      gemResult = JSON.parse(result);
    } catch {
      // If Gemini returns ```json ... ```
      const jsonMatch = result.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return res.status(400).json({
          response:
            "Sorry, I didn't understand that. Please try again.",
        });
      }

      gemResult = JSON.parse(jsonMatch[0]);
    }

    const { type, userInput, response } = gemResult;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format(
            "YYYY-MM-DD"
          )}`,
        });

      case "get-time":
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format(
            "hh:mm A"
          )}`,
        });

      case "get-day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format(
            "dddd"
          )}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput,
          response: `Current month is ${moment().format(
            "MMMM"
          )}`,
        });

      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput,
          response,
        });

      default:
        return res.json({
          type: "general",
          userInput: promptUser,
          response:
            response ||
            "Sorry, I didn't understand that.",
        });
    }
  } catch (error) {
    console.error("Error in askToAssistant:", error);

    if (error.status === 429 || error.code === 429) {
      return res.status(429).json({
        response:
          "Gemini rate limit exceeded. Please try again later.",
      });
    }

    return res.status(500).json({
      response: "Something went wrong.",
      error: error.message,
    });
  }
};
