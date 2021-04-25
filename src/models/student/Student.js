import BaseModel from "../BaseModel";
import ConstantController from "../../controllers/ConstantController";

export default class Student extends BaseModel {
  constructor(data) {
    super(data);
    this.isShow = true;
    this.trophyCount = this.trophyCount || 0;
    this.networkStatus = "优";
    this.micStatus = ConstantController.MIC_STATUS.MUTE;
  }
}
