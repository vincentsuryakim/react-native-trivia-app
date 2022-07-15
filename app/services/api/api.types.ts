import { GeneralApiProblem } from "./api-problem"
import { QuestionSnapshot } from "../../models"

export type GetQuestionsResult = { kind: "ok"; questions: QuestionSnapshot[] } | GeneralApiProblem