export default function (state = {}, action) {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                loading: true
            } 

            case "UNSET_LOADING":
                return {
                    ...state,
                    loading: false
                }

                default:
                    return state
    }
}