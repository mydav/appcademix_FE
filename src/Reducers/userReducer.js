export default function (state = {}, action) {
    switch (action.type) {
        case "SET_USER": 
            return  action.payload
            

            case "UNSET_USER":
                return undefined

                default:
                    return state
    }
}