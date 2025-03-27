
import noNetworkImage from '@/assets/images/NO_NETWORK_LIMBS_Orthopaedic.png';

export const NetworkError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-lg w-full">
        <img
          src={noNetworkImage}
          alt="No Network Connection"
          className="w-full h-auto max-w-md mx-auto"
        />
      </div>
    </div>
  );
};
