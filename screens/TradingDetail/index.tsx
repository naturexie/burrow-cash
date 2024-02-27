import { useAppDispatch } from "../../redux/hooks";
import { LayoutBox } from "../../components/LayoutContainer/LayoutContainer";

const Trading = () => {
  const dispatch = useAppDispatch();
  return (
    <LayoutBox className="flex flex-col items-center justify-center">trading action page</LayoutBox>
  );
};

export default Trading;
