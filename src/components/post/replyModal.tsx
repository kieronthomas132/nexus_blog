import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { IModal } from "../homepage/createPostModal.tsx";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { useState } from "react";
import { useCreateReply } from "../../lib/react-query/queries&Mutations.tsx";
const ReplyModal = ({ isOpen, onOpenChange, comment }: IModal) => {
  const { user } = useAuthContext();
  const [replyValue, setReplyValue] = useState("");

  const { mutateAsync: createReply, isPending: isCreatingReply } =
    useCreateReply();
  const handleCreateReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment?.$id) {
      try {
        const newReply = await createReply({
          replyValue: replyValue,
          commentId: comment?.$id,
          repliedComment: comment?.$id,
          replier: user.id,
        });

        onClose();

        return newReply;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onClose = () => {
    setReplyValue("");
    onOpenChange(false);
  };
  return (
    <>
      <Modal
        placement="center"
        className="bg-[#19191C] text-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <form onSubmit={handleCreateReply}>
            <ModalBody>
              <div className="mt-2 flex jc items-center gap-3">
                <img
                  alt={comment?.commenter?.$id}
                  className="w-[40px] rounded-full"
                  src={comment?.commenter?.profilePic}
                />
                <div>
                  <h3 className="font-[600] text-[16px]">
                    {comment?.commenter?.name}
                  </h3>
                  <h4 className="text-neutral-500 text-sm">
                    @{comment?.commenter?.username}
                  </h4>
                </div>
              </div>
              <div className="ml-[19px] flex items-center gap-2">
                <div className="h-[50px] rounded-full w-[2px] bg-[#FC356D]" />
                <h3 className="text-neutral-500 text-sm">
                  Replying to @{comment?.commenter?.username}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <img
                  className="w-[40px] rounded-full"
                  src={user?.profilePic}
                  alt={user?.name}
                />
                <input
                  value={replyValue}
                  onChange={(e) => setReplyValue(e.target.value)}
                  type="text"
                  className="w-full p-2.5 rounded-full bg-transparent border border-[#FC356D] focus:outline-none text-white text-sm"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                type="submit"
                className="bg-[#FC356D] focus:outline-none text-white "
              >
                {isCreatingReply ? "Replying" : "Reply"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReplyModal;
