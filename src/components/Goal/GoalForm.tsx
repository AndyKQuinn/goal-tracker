import { useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '../../utils/trpc';
import Router from 'next/router';

export default function GoalForm() {
  const { user } = useUser();
  const { sub } = user || { sub: '' };
  
  const utils = trpc.useContext();
  const addGoal = trpc.useMutation('goals.add', {
    async onSuccess() {
      await utils.invalidateQueries(['goals.all']);
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const input = data;
    
    input.active = true;
    input.createdBy = sub;

    try {
      await addGoal.mutateAsync(input);
      reset();
      Router.push("/dashboard")
    } catch {
      (error: any) => console.log(error);
    }
  };

  return (
    <div className="p-2 text-center bg-gray-200">
      <div className="mb-1 text-xl bg-gray-300 ">
        Add Goal
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <span>Title</span>
          <div className="mt-2">
            <input
              className="block w-full form-input"
              {...register("title")}
              placeholder="Goal Title"
            />
          </div>
        </div>
        <div className="mt-4">
          <span>Description</span>
          <div className="mt-2">
            <input
              className="block w-full form-input"
              {...register("description")}
              placeholder="Goal Description"
            />
          </div>
        </div>       
        <input className="m-1 mt-4 text-white bg-gray-600 btn" type="submit" />
        {addGoal.error && (
          <p style={{ color: 'red' }}>{addGoal.error.message}</p>
        )}
      </form>
    </div>
  );
}
