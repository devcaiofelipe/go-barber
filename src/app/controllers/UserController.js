import User from '../models/User';
import Cache from '../../lib/Cache';


class UserController {
  async store(req, res) {
    const emailAlreadyExists = await User.findOne({
      where: { email: req.body.email }
    });

    if(emailAlreadyExists) {
      return res.status(400).json({
        error: 'User already exists'
      });
    };

    const { id, name, email, provider } = await User.create(req.body);

    if(provider) {
      await Cache.invalidate('providers');
    };

    return res.json({
      id,
      name,
      email,
      provider
    });
  };

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if(email && email !== user.email) {
      const emailAlreadyExists = await User.findOne({
        where: { email: email }
      });
  
      if(emailAlreadyExists) {
        return res.status(400).json({ error: 'User already exists' });
      };
    };

    if(oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    };

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  };
};

export default new UserController();