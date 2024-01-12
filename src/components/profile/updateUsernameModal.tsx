import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IModal } from "../homepage/createPostModal.tsx";
import { useState } from "react";
import { useUpdateUsername } from "../../lib/react-query/queries&Mutations.tsx";

const UpdateUsernameModal = ({ isOpen, onOpenChange, profileId }: IModal) => {
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: updateUsername, isPending: isUpdatingUsername } =
    useUpdateUsername();

  const handleUpdateUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (profileId) {
      try {
        await updateUsername({
          profileId: profileId,
          username: username,
        });
        setFormError(null);
        onClose();
      } catch (error:any) {
        setFormError(error.message);
      }
    }
  };

  const onClose = () => {
    setUsername("");
    setFormError(null);
    onOpenChange(false);
  };
  return (
    <div>
      <Modal
        placement="center"
        className="bg-[#19191C] text-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateUsername}>
              <ModalHeader className="flex flex-col gap-1">
                Update Username
              </ModalHeader>
              <ModalBody>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="border border-[#FC356D] bg-transparent p-2.5 rounded-full focus:outline-none text-sm"
                />
                {formError && <p className="text-red-500">{formError}</p>}{" "}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  className="bg-[#FC356D] text-white"
                  disabled={isUpdatingUsername}
                >
                  {isUpdatingUsername ? "Updating" : "Update Username"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateUsernameModal;
