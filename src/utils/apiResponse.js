export class ApiResponse {
  constructor(message, data = null, meta = null) {
    this.success = true;
    this.message = message;
    if (data) {
      this.data = data
    }
    if (meta) {
      this.meta = meta;
    }
  }
}
