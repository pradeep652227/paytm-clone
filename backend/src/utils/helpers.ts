export default {
    response: (status: boolean = true, message: string = 'Request processed successfully!!', data: any = null, error: any = null) => {
        return {
            status,
            message,
            data,
            error
        }
    },
}