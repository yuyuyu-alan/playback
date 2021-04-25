
class UserController {
    constructor() {
      this.instance = null;
    }
    static getInstance() {
      if (!this.instance) {
        this.instance = new UserController();
      }
      return this.instance;
    }
  
    listen() { // 开始简监听
  
    }
  
  
  }
  
  export default UserController;
  