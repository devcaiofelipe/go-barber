import * as Yup from 'yup';

export default async(req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password_virtual: Yup.string().min(6).when('oldPassword', (oldPassword, field) => {
        return oldPassword ? field.required() : field;
      }),
      confirmPassword: Yup.string().when('password_virtual', (password_virtual, field) => {
        return password_virtual ? field.required().oneOf([Yup.ref('password_virtual')]) : field;
      }),
    });

    
    await schema.validate(req.body, { abortEarly: false });
    return next();
    
  } catch(error) {
    return res.status(400).json({ error: 'Validation fails', message: error.inner });
  };
};