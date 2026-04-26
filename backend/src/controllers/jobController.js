import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, type, salary, skills } =
      req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      type,
      salary,
      skills,
      employer: req.user._id, // comes from the protect middleware
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, type, location, page = 1, limit = 10 } = req.query;

    // Build the query object dynamically
    const query = { status: "open" };

    if (search) {
      query.$text = { $search: search };
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" }; // case-insensitive
    }

    // Pagination math
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("employer", "name email avatar") // replace employer id with actual user data
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(Number(limit));

    res.json({
      jobs,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalJobs: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "name email avatar",
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Make sure the logged-in employer owns this job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // new: true returns the updated doc
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Make sure the logged-in employer owns this job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
