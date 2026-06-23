class ApiResponse{
    constructor(statusCode, data, message = "Success", totalCount = null, page = null, pageSize = null){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        if (totalCount !== null) this.totalCount = totalCount;
        if (page !== null) this.page = page;
        if (pageSize !== null) this.pageSize = pageSize;
    }
}

export default ApiResponse;