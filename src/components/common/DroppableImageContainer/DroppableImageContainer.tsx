import { Image, Label, MainBox, UploadBtn } from './elements';

interface DroppableImageContainerProps {
  image: string | File | null;
}

const DroppableImageContainer = ({ image }: DroppableImageContainerProps) => (
  <MainBox>
    <Label>
      {
        image
          ? <>Фотография заружена. <UploadBtn>Выбрать другую?</UploadBtn></>
          : <><UploadBtn>Выберите</UploadBtn> или перетащите сюда фотографию</>
      }
    </Label>
    {
      image && (
        <Image
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
        />
      )
    }
  </MainBox>
);

export default DroppableImageContainer;
