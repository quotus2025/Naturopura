// controllers/subsidyController.ts
import { Request, Response } from "express";
import Subsidy from "../models/Subsidy";

export const applySubsidy = async (req: Request, res: Response) => {
  try {
    const subsidy = new Subsidy({
      ...req.body,
      farmerId: req.user._id, // assuming auth middleware adds `user`
    });
    await subsidy.save();
    res.status(201).json({ message: "Subsidy applied successfully", subsidy });
  } catch (err) {
    res.status(500).json({ message: "Error applying subsidy", error: err });
  }
};

export const updateSubsidyStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await Subsidy.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Subsidy ${status}`, updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err });
  }
};

export const getFarmerSubsidies = async (req: Request, res: Response) => {
  try {
    const subsidies = await Subsidy.find({ farmerId: req.user._id });
    res.json(subsidies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subsidies", error: err });
  }
};

export const getAllSubsidies = async (_req: Request, res: Response) => {
  try {
    const subsidies = await Subsidy.find().populate("farmerId");
    res.json(subsidies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all subsidies", error: err });
  }
};
