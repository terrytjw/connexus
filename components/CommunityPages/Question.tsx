import Image from "next/image";
import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { answerQuestionAPI } from "../../lib/api-helpers/question-api";
import { QuestionWithUser } from "../../utils/types";
import Button from "../Button";
import CustomLink from "../CustomLink";

type questionProps = {
  question: QuestionWithUser;
  mutateQuestions: any;
  isCommunityCreator: boolean;
};

const Question = ({
  question,
  mutateQuestions,
  isCommunityCreator,
}: questionProps) => {
  const [answer, setAnswer] = useState("");

  const answerQuestion = async () => {
    const res = await answerQuestionAPI(question.questionId, answer);

    mutateQuestions((data: QuestionWithUser[]) => {
      const updatedItems = data.map((item) => {
        if (item.questionId === res.questionId) {
          return { ...item, ...res };
        }
        return item;
      });
      return updatedItems;
    });
  };

  return (
    <div className="card border-2 border-gray-200 bg-white">
      <div className="card-body p-4 sm:p-8">
        <div className="mb-2 flex w-full flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              height={48}
              width={48}
              className="aspect-square rounded-full object-cover object-center"
              src={question.user.profilePic ?? ""}
              alt="Creator profile pic"
            />
            <CustomLink
              href={`/user/profile/${question.userId}`}
              className="text-gray-700"
            >
              {question.user.username}
            </CustomLink>
          </div>
          <span className="text-gray-500">
            {new Date(question.date).toLocaleString("en-gb", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-700">
          {question.question}
        </p>

        {question.answer ? (
          <p className="border-l-2 pl-4 text-gray-700">{question.answer}</p>
        ) : (
          <>
            {isCommunityCreator ? (
              <div className="relative mt-1 flex w-full items-center rounded-md shadow-sm">
                <textarea
                  className="textarea-bordered textarea block w-full items-center overflow-hidden rounded-md pr-12 focus:outline-none"
                  placeholder="Reply to this question"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <Button
                  className="absolute bottom-4 right-2 flex items-center border-0"
                  variant="outlined"
                  size="sm"
                  type="button"
                  onClick={() => {
                    answerQuestion();
                  }}
                >
                  <FaTelegramPlane />
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Question;
