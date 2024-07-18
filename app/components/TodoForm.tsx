"use client";

import { useForm } from 'react-hook-form';
import styles from '../styles/Main.module.css';

const TodoForm = ({ onSubmit, buttonText, initialTitle = '', initialDescription = '' }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: initialTitle,
      description: initialDescription
    }
  });

  const submitHandler = (data) => {
    onSubmit(data.title, data.description);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <input {...register('title')} placeholder="Title" className={styles.input} />
      <input {...register('description')} placeholder="Description" className={styles.input} />
      <button type="submit" className={styles.button}>{buttonText}</button>
    </form>
  );
};

export default TodoForm;
