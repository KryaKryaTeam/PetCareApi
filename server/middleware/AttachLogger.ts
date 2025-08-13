import { NextFunction, Request } from "express";
import { Logger } from "../utils/logger";

export function AttachLogger(req, res, next) {
  req.logger = new Logger(req.path);

  const old_ = res.json;

  res.json = new Proxy(old_, {
    apply(target, thisArg, argArray) {
      req.logger.end();
      return target.apply(thisArg, argArray);
    },
  });

  next();
}
