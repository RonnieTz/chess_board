type Props = {
  piece: string | null;
  color: string | null;
};

const Piece = ({ piece, color }: Props) => {
  return (
    <>
      {piece && (
        <img
          style={{ width: '90%' }}
          src={`/${color}_${piece}.svg`}
          alt={`${color} ${piece}`}
        />
      )}
    </>
  );
};
export default Piece;
