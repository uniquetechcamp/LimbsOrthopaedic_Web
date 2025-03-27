
import noNetworkImage from '@/assets/images/NO_NETWORK_LIMBS_Orthopaedic.png';

export const NetworkError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-lg w-full text-center">
        <img
          src={noNetworkImage}
          alt="No Network Connection"
          className="w-full h-auto max-w-md mx-auto"
        />
        <h2 className="text-xl font-semibold mt-4">No Internet Connection</h2>
        <p className="text-gray-600 mt-2">Please check your network connection and try again</p>
      </div>
    </div>
  );
};
