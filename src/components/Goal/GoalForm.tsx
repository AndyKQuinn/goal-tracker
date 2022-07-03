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
    <div className="p-2 m-1 text-center border-2 border-gray-100 rounded-md">
      <div className="p-1 mb-1 text-xl text-white bg-purple-600 border-2 rounded-md">
        Add Goal
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <div className="mt-2">
            <input
              className="block w-full form-input"
              {...register("title")}
              placeholder="Goal Title"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="mt-2">
            <input
              className="block w-full form-input"
              {...register("description")}
              placeholder="Goal Description"
            />
          </div>
        </div>       
        <input className="m-1 mt-4 text-white bg-purple-600 btn" type="submit" />
        {addGoal.error && (
          <p style={{ color: 'red' }}>{addGoal.error.message}</p>
        )}
      </form>
    </div>
  );
}
