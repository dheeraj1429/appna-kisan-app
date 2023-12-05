export const AuthReducer = (state,action)=>{
    switch (action.type) {
        case "LOG_IN":
            return {
                ...state,
                isAuthenticated:true,
                user:action.payload,
                error:false
            }
        case "LOG_OUT":
            return {
                ...state,
                isAuthenticated:false,
                user:null,
                error:false
            }
        case "ERROR":
            return {
                ...state,
                error:action.error,
                isAuthenticated:false,
                user:null,

            }
    
        default:
         return state;
    }
}

