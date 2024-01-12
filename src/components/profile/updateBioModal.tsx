import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { IModal } from "../homepage/createPostModal.tsx";
import { useUpdateBio } from "../../lib/react-query/queries&Mutations.tsx";

const UpdateBioModal = ({ isOpen, onOpenChange, profileId }: IModal) => {
  const [bio, setBio] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: updateBio, isPending: isUpdatingBio } = useUpdateBio();

  const handleUpdateBio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (profileId) {
      try {
        const updatedBio = await updateBio({ profileId, bio });

        if (!updatedBio) {
          new Error();
        }

        onClose();
        return updatedBio;
      } catch (error) {
        setFormError("Failed to update bio.");
      }
    }
  };

  const onClose = () => {
    setBio("");
    setFormError(null);
    onOpenChange(false);
  };

  return (
    <div>
      <Modal
         placement='center'
        className="bg-[#19191C] text-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateBio}>
              <ModalHeader className="flex flex-col gap-1">
                Update Bio
              </ModalHeader>
              <ModalBody>
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                  disabled={isUpdatingBio}
                >
                  {isUpdatingBio ? "Updating" : "Update Bio"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateBioModal;
