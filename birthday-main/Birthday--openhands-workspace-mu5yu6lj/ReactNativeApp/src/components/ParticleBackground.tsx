import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

const ParticleBackground: React.FC = () => {
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    createParticles();
    startAnimation();

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  const createParticles = () => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 15; i++) {
      const particle: Particle = {
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height + 50),
        opacity: new Animated.Value(0.3 + Math.random() * 0.4),
        scale: new Animated.Value(0.5 + Math.random() * 0.5),
      };
      
      newParticles.push(particle);
      animateParticle(particle);
    }
    
    particles.current = newParticles;
  };

  const animateParticle = (particle: Particle) => {
    const duration = 4000 + Math.random() * 4000; // 4-8 seconds
    const endX = Math.random() * width;
    const endY = -50;

    Animated.parallel([
      Animated.timing(particle.x, {
        toValue: endX,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(particle.y, {
        toValue: endY,
        duration,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(particle.opacity, {
          toValue: 0.8,
          duration: duration * 0.3,
          useNativeDriver: false,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: duration * 0.7,
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      // Reset particle position and restart animation
      particle.x.setValue(Math.random() * width);
      particle.y.setValue(height + 50);
      particle.opacity.setValue(0.3 + Math.random() * 0.4);
      animateParticle(particle);
    });
  };

  const startAnimation = () => {
    animationRef.current = setInterval(() => {
      createParticles();
    }, 10000);
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: [{ scale: particle.scale }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ParticleBackground;