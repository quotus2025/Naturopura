export const verifyToken = async (req: Request, res: Response) => {
  try {
    // Token is already verified by auth middleware
    const user = req.user;
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kyc: user.kyc  // Add this line to include KYC data
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};


