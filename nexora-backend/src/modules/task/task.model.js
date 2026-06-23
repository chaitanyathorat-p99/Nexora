import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date
    },
    // Array of user IDs (supports multi-assign)
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        default: null
    },
    // Frontend uses "taskStages" for the kanban stage
    taskStages: {
        type: String,
        enum: ["New", "Assigned", "In Process", "Review", "Completed"],
        default: "New"
    },
    // Whether the task is marked done
    taskStatus: {
        type: Boolean,
        default: false
    },
    // Required when taskStatus = true
    outcome: {
        type: String,
        trim: true,
        default: ""
    },
    subtasks: [{
        title: {
            type: String,
            default: ""
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    }],
    // Arbitrary key-value map for dynamic fields
    dynamicFields: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
