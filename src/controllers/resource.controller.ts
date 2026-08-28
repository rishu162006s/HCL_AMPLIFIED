import { Request, Response } from "express";

import {
  createNewResource,
  getResource,
  getResources,
  getResourcesByDifficulty,
  getResourcesByType,
  removeResource,
  updateExistingResource,
} from "../services/resource.service";

import {
  createResourceSchema,
  resourceDifficultySchema,
  resourceTypeSchema,
  updateResourceSchema,
} from "../validators/resource.validators";

export const createResourceController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createResourceSchema.parse(req.body);

    const resource = await createNewResource(data);

    res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getResourcesController = async (
  req: Request,
  res: Response
) => {
  try {
    const resources = await getResources();

    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getResourceController = async (
  req: Request,
  res: Response
) => {
  try {
    const resourceId = req.params.resourceId;

    if (!resourceId) {
      res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });

      return;
    }

    const resource = await getResource(resourceId as string);

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RESOURCE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Resource not found",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getResourcesByTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = resourceTypeSchema.parse({
      type: req.params.type,
    });

    const resources = await getResourcesByType(
      data.type
    );

    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getResourcesByDifficultyController =
  async (req: Request, res: Response) => {
    try {
      const data = resourceDifficultySchema.parse({
        difficulty: req.params.difficulty,
      });

      const resources =
        await getResourcesByDifficulty(
          data.difficulty
        );

      res.status(200).json({
        success: true,
        data: resources,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const updateResourceController = async (
  req: Request,
  res: Response
) => {
  try {
    const resourceId = req.params.resourceId;

    if (!resourceId) {
      res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });

      return;
    }

    const data = updateResourceSchema.parse(req.body);

    const resource =
      await updateExistingResource(
        resourceId as string,
        data
      );

    res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RESOURCE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Resource not found",
      });

      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteResourceController = async (
  req: Request,
  res: Response
) => {
  try {
    const resourceId = req.params.resourceId;

    if (!resourceId) {
      res.status(400).json({
        success: false,
        message: "Resource ID is required",
      });

      return;
    }

    await removeResource(resourceId as string);

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RESOURCE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Resource not found",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};