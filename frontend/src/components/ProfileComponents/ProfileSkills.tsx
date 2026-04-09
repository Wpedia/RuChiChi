import { Target } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  max: number;
  color: string;
}

interface Props {
  skills: Skill[];
}

export function ProfileSkills({ skills }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-black/30 p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="text-indigo-500" size={20} />
        Навыки
      </h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{skill.level}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}