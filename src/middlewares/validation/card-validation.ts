import { Joi, celebrate } from 'celebrate';
import { regExp } from '../../utils/regular-expressions';

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regExp).required()
  })
});

export const getCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
});