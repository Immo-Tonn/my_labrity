import { useEffect, useState } from 'react';
import type { Condition } from './types';
import styles from './Conditions.module.css';
import { classnames } from '@/utils/classnames';

export const Conditions = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    const conditionsData: Condition[] = [
      {
        _id: '1',
        title: 'Terminvereinbarung',
        description: [
          {
            children: [
              { text: 'Termine werden nach vorheriger Vereinbarung gebucht.' },
            ],
          },
        ],
      },
      {
        _id: '2',
        title: 'Pünktlichkeit',
        description: [
          {
            children: [
              { text: 'Bitte erscheinen Sie pünktlich zu Ihrem Termin.' },
            ],
          },
        ],
      },
      {
        _id: '3',
        title: 'Stornierung',
        description: [
          {
            children: [
              {
                text: 'Eine Terminabsage ist mindestens 24 Stunden vorher erforderlich.',
              },
            ],
          },
        ],
      },
    ];

    setConditions(conditionsData);
  }, []);

  const conditionsClasses = classnames(
    styles.conditions,
    'scrollbar-thin scrollbar-thumb-[#395734] scrollbar-track-[#A7D7A5]',
    'overflow-y-scroll prose max-w-full font-normal text-accent',
  );

  return (
    <div className={conditionsClasses}>
      {conditions.map(item => (
        <div key={item._id} className="mb-6">
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>

          {Array.isArray(item.description) && item.description.length > 0 && (
            <div className="mt-2 text-white/80">
              {item.description.map((block, index) => (
                <p key={index}>
                  {Array.isArray(block.children) && block.children.length > 0
                    ? block.children[0].text || ''
                    : ''}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
