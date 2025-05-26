import API from "./axios";
import { Interaction } from "@/types/interaction";

export const getAllInteractions = () => API.get("/Interactions");
export const getInteractionById = (id: string) => API.get(`/Interactions/${id}`);
export const createInteraction = (data: Omit<Interaction, "id">) => API.post("/Interactions", data);
export const updateInteraction = (id: string, data: Omit<Interaction, "id">) => API.put(`/Interactions/${id}`, data);
export const deleteInteraction = (id: string) => API.delete(`/Interactions/${id}`); 