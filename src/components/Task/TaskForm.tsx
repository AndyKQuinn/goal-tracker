import { trpc } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import Router from 'next/router';
import toast from 'react-hot-toast';

type FormValues = {
  title: string,
  description: string,
  quantity: number,
  cadence: string,
  goalId: string,
  taskEntities: [],
}

export default function TaskForm() {
  const { user } = useUser();
  const id = user?.sub || "defaultUser"
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])
  
  const utils = trpc.useContext();
  const addTask = trpc.useMutation('tasks.add', {
    onSuccess() {
      toast.success('Task added successfully')
      utils.invalidateQueries(['tasks.all']);
    },
  });

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      quantity: 1,
      cadence: "daily",
      goalId: "",
      taskEntities: [],
    }
  });

  const onSubmit = async (data: any) => {
    const input = data;
    input.createdBy = id
    input.active = true

    try {
      addTask.mutateAsync(input);
      reset();
      Router.push("/")
    } catch {
      (error: any) => toast.error(error);
    }
  };

  return (
    <div className="p-2 mx-1 text-center rounded-md">
      <div className="p-2 m-2 font-serif text-4xl tracking-wider text-center text-white border-b-4 border-b-purple-900">
        Add Tasks
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block mt-4">
            <div className="p-2 text-white">Choose a Goal</div>
            <select
              className="block w-full form-select"
              {...register("goalId")}
              required
            >
              {goalsQuery.data?.map((goal) => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </label>
          <div className="mt-10">
            <div className="mt-2">
              <input 
                className="block w-full form-input"
                placeholder="Task Title"
                {...register("title")}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="mt-2">
              <input 
                className="block w-full form-input"
                placeholder="Task Description"
                {...register("description")}
              />
            </div>
          </div>
        </div>
        <input className="m-1 mt-4 text-white bg-purple-600 btn" type="submit" />
        {addTask.error && (
          toast.error(addTask.error.message)
        )}
      </form>
    </div>
  );
}
