export default function (state = {}, action) {
    switch (action.type) {
        case "SHOW_ERROR":
            return {
                ...state,
                errorMessage: action.payload
            }

            case "HIDE_ERROR":
                return { 
                    ...state,
                    errorMessage: ''
                }

                default:
                    return state
    }
}