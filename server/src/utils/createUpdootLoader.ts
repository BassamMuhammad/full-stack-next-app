import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot>(async (keys) => {
    const updoots = await Updoot.findByIds(keys as any[]);
    const userIdtoUser: Record<string, Updoot> = {};
    updoots.forEach(
      (updoot) => (userIdtoUser[`${updoot.postId}|${updoot.userId}`] = updoot)
    );
    return keys.map((key) => userIdtoUser[`${key.postId}|${key.userId}`]);
  });
