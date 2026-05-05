'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persist';

import { sendMessage } from '@/api/telegram';

import {
  FormInput,
  Button,
  ModalError,
  ModalSuccess,
  Loader,
} from '@/components/ui';

import { FormData } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const Form = () => {
  const { lang } = useLanguage();

  const [common, setCommon] = useState<any>(null);
  const [contacts, setContacts] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      const commonData = await getData('common', lang);
      const contactsData = await getData('contact', lang);

      setCommon(commonData);
      setContacts(contactsData);
    };

    loadData();
  }, [lang]);

  useFormPersist('FormData', {
    watch,
    setValue,
  });

  if (!common || !contacts) return null;

  const checkboxInput = watch(contacts.checkBox.name);

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      setIsLoading(true);

      const message = `Name: ${data.name} %0AEmail: ${data.email} %0APhone: ${
        data.phone
      } %0A${data.message ? `Message: ${data.message}` : ''}`;

      await sendMessage(message);

      reset();
      window.sessionStorage.removeItem('FormData');

      setShowSuccessModal(true);
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickCloseModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  return (
    <>
      <form
        className="flex flex-col xl:w-[592px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {contacts.inputs.map((item: any) => (
          <FormInput
            key={item.name.label}
            textarea={item.name.textarea}
            config={item.name}
            register={register}
            errors={errors}
          />
        ))}

        <Button
          tag="button"
          buttonType="submit"
          accent={true}
          className="w-full px-12 md:w-[185px] smOnly:mx-auto mdOnly:py-3"
        >
          {!isLoading ? common.buttonsText.v3 : <Loader />}
        </Button>
      </form>

      {showSuccessModal && (
        <ModalSuccess
          isModalSuccessOpen={showSuccessModal}
          onClickCloseModal={onClickCloseModal}
        />
      )}

      {showErrorModal && (
        <ModalError
          isModalErrorOpen={showErrorModal}
          onClickCloseModal={onClickCloseModal}
        />
      )}
    </>
  );
};
