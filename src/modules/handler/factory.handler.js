import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";


export const deleteOne = (model) => {
    return catchAsyncError(async (req, res, next) => {
        const { id } = req.params ;
        let result = await model.findByIdAndDelete(id);
        if(!result){
            return next(new AppError(`Document not found ${req.originalUrl}`, 404))
        }
        res.json({message: "success", result })
    })
}
