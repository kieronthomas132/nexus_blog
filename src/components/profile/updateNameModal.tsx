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
import { useUpdateName } from "../../lib/react-query/queries&Mutations.tsx";

const UpdateNameModal = ({ isOpen, onOpenChange, profileId }: IModal) => {
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: updateName, isPending: isUpdatingName } =
    useUpdateName();

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (profileId) {
      const newName = await updateName({ profileId: profileId, name: name });

      if (!newName) {
        setFormError("Failed to update bio.");
      }

      onClose();
      return newName;
    }
  };

  const onClose = () => {
    setName("");
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
            <form onSubmit={handleUpdateName}>
              <ModalHeader className="flex flex-col gap-1">
                Update Name
              </ModalHeader>
              <ModalBody>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  disabled={isUpdatingName}
                >
                  {isUpdatingName ? "Updating" : "Update Name"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateNameModal;
