import { Dispatch, SetStateAction, useState } from "react";
import { Models } from "appwrite";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { useCreateNewPost } from "../../lib/react-query/queries&Mutations.tsx";
import {appwriteConfig, storage} from "../../lib/config.tsx";
import { ID } from "appwrite";
import {INewPost} from "../../lib/api.tsx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FaRegImage } from "react-icons/fa";

export interface IModal {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  profile?: Models.Document;
  comment?: Models.Document
  profileId?:string
}
const CreatePostModal = ({ isOpen, onOpenChange }: IModal) => {
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutateAsync: createPost, isPending: isPostPending } =
    useCreateNewPost();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setSelectedFile(selectedImage);

      const imageURL = URL.createObjectURL(selectedImage);
      setImagePreview(imageURL);
    }
  };

  const createNewPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageURL = "";
    let imageID = "";

    try {
      if (selectedFile) {
        const response = await storage.createFile(
          appwriteConfig.STORAGE_COLLECTION_ID,
          ID.unique(),
          selectedFile,
        );
        if (response && response["$id"]) {
          console.log(response);
          imageURL = `https://cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.STORAGE_COLLECTION_ID}/files/${response["$id"]}/view?project=659c07ce2f49cc57b0d6&mode=admin`;
          imageID = response["$id"];
        }
      }

      const newPost: INewPost = {
        userId: user.id,
        title: title,
        content: content,
      };

      if (imageURL && imageID) {
        newPost.imageURL = imageURL;
        newPost.imageId = imageID;
      }

      await createPost(newPost);
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const onClose = () => {
    setTitle("");
    setContent("");
    setSelectedFile(null);
    setImagePreview(null);
    onOpenChange(false);
  };
  return (
    <Modal
      placement="center"
      className="bg-[#19191C] relative text-white min-h-[300px] overflow-y-auto"
      isOpen={isOpen}
      onOpenChange={onClose}
    >

      <ModalContent>
        <form onSubmit={createNewPost}>
          <ModalHeader className="flex flex-col gap-1">
            Create new post
          </ModalHeader>
          <ModalBody>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              className="p-3 text-sm rounded-md focus:outline-none bg-transparent border text-white border-[#FC356D]"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="resize-none h-[100px] p-2 focus:outline-none text-sm rounded-md bg-transparent border text-white border-[#FC356D]"
            />
          </ModalBody>
          <div className="flex items-center justify-center w-full">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected Image Preview"
                className="mt-4 w-[200px] object-cover"
              />
            )}
          </div>
          <ModalFooter className="flex justify-between items-center">
            <div>
              <label htmlFor="fileUpload" className="cursor-pointer">
                <FaRegImage className="text-[25px]" />
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <div className="flex items-center gap-[10px]">
              <Button color="danger" variant="light" onClick={onClose}>
                Close
              </Button>
              <Button
                className="bg-[#FC356D] text-white"
                type="submit"
                color="primary"
              >
                {isPostPending ? "Posting" : "Post"}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
