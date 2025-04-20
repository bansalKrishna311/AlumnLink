import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
		attachment: {
			type: String,
			default: null,
		}
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;