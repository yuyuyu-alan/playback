import BaseModel from "../BaseModel";
import ConstantController from "../../controllers/ConstantController";

export default class Room extends BaseModel {
  static getNetworkText(netQuality) {
    switch (netQuality) {
      case 1:
        return "优";
      case 2:
        return "良";
      case 3:
        return "中";
      case 4:
        return "差";
      case 5:
      case 6:
        return "极差";
      default:
        return "未知";
    }
  }

  static getRoomLayoutType(type) {
    switch (Number(type)) {
      case ConstantController.LAYOUT_TYPE.DEFAULT:
        return "default";
      case ConstantController.LAYOUT_TYPE.SQUARE:
        return "square";
      case ConstantController.LAYOUT_TYPE.SINGLE:
        return "single";
      case ConstantController.LAYOUT_TYPE.SINGLE_TO_RIGHT:
        return "singleToRight";
      case ConstantController.LAYOUT_TYPE.SINGLE_TO_BOTTOM:
        return "singleToBottom";
    }
  }

  static getRoomDefaultLayoutType(type) {
    switch (Number(type)) {
      case ConstantController.ROOM_TYPE.SINGLE:
        return Room.getRoomLayoutType(
          ConstantController.LAYOUT_TYPE.SINGLE_TO_RIGHT
        );
      case ConstantController.ROOM_TYPE.DEFAULT:
      default:
        return Room.getRoomLayoutType(ConstantController.LAYOUT_TYPE.DEFAULT);
    }
  }
}
