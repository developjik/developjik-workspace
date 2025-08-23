import React from 'react';
import { Skill } from '@site/src/data/profile';
import styles from './styles.module.css';

interface SkillBarProps {
  skill: Skill;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  const percentage = (skill.level / 10) * 100;

  return (
    <div className={styles.skillItem}>
      <div className={styles.skillHeader}>
        <h4 className={styles.skillName}>{skill.name}</h4>
        <div className={styles.skillMeta}>
          <span className={styles.skillExperience}>{skill.experience}</span>
          <span className={styles.skillLevel}>{skill.level}/10</span>
        </div>
      </div>
      
      <div className={styles.skillBarContainer}>
        <div 
          className={styles.skillBar}
          style={{ '--skill-percentage': `${percentage}%` } as React.CSSProperties}
        >
          <div className={styles.skillFill}></div>
        </div>
      </div>
      
      {skill.description && (
        <p className={styles.skillDescription}>{skill.description}</p>
      )}
    </div>
  );
};

export default SkillBar;