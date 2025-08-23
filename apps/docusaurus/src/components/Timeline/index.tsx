import React from 'react';
import { Experience } from '@site/src/data/profile';
import styles from './styles.module.css';

interface TimelineProps {
  experiences: Experience[];
}

const Timeline: React.FC<TimelineProps> = ({ experiences }) => {
  const getTypeIcon = (type: Experience['type']) => {
    switch (type) {
      case 'work':
        return '💼';
      case 'education':
        return '🎓';
      case 'project':
        return '🚀';
      default:
        return '📋';
    }
  };

  const getTypeLabel = (type: Experience['type']) => {
    switch (type) {
      case 'work':
        return '경력';
      case 'education':
        return '교육';
      case 'project':
        return '프로젝트';
      default:
        return '기타';
    }
  };

  return (
    <div className={styles.timeline}>
      {experiences.map((experience, index) => (
        <div key={experience.id} className={styles.timelineItem}>
          <div className={styles.timelineMarker}>
            <div className={styles.timelineIcon}>
              {getTypeIcon(experience.type)}
            </div>
          </div>
          
          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineTitle}>
                <h3>{experience.position}</h3>
                <h4>{experience.company}</h4>
              </div>
              <div className={styles.timelineMeta}>
                <span className={styles.timelineType}>
                  {getTypeLabel(experience.type)}
                </span>
                <span className={styles.timelinePeriod}>
                  {experience.period}
                </span>
              </div>
            </div>
            
            <p className={styles.timelineDescription}>
              {experience.description}
            </p>
            
            <div className={styles.achievements}>
              <h5 className={styles.achievementsTitle}>주요 성과</h5>
              <ul className={styles.achievementsList}>
                {experience.achievements.map((achievement, idx) => (
                  <li key={idx} className={styles.achievementItem}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.techStack}>
              <h5 className={styles.techStackTitle}>기술 스택</h5>
              <div className={styles.techTags}>
                {experience.techStack.map((tech, idx) => (
                  <span key={idx} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;