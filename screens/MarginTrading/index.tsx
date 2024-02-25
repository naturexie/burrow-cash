import { useAppDispatch } from "../../redux/hooks";
import { LayoutBox } from "../../components/LayoutContainer/LayoutContainer";

const MarginTrading = () => {
  const dispatch = useAppDispatch();
  return (
    <LayoutBox className="flex flex-col items-center justify-center">
      maring trading list page
    </LayoutBox>
  );
};

export default MarginTrading;
