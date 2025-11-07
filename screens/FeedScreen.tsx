// screens/FeedScreen.tsx - ĐÃ NÂNG CẤP LÊN ẢNH THẬT

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config";
import { getAssetImage } from "../utils/ImageManager";

// ==========================================================
// ✅ Interface cho dữ liệu
// ==========================================================
interface FeedUser {
  name: string;
  verified: boolean;
  avatar: string;
  avatarKey?: string;
}

interface FeedTrack {
  title: string;
  artist: string;
  artwork: string;
  artworkColor: string;
  artworkKey?: string;
  plays: string | number;
  duration: string;
}

interface FeedComment {
  id: string;
  user: string;
  avatar: string;
  avatarKey?: string;
  text: string;
  time: string;
  likes: number;
  reply?: boolean;
}

interface FeedPostData {
  id: string;
  user: FeedUser;
  postTime: string;
  track: FeedTrack;
  engagement: {
    likes: number;
    comments: number;
    reposts: number;
  };
  comments?: FeedComment[];
}

// ==========================================================
// COMPONENT: FeedPost
// ==========================================================
function FeedPost({
  post,
  onExpandComments,
}: {
  post: FeedPostData;
  onExpandComments: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const likeCount = post.engagement.likes + (liked ? 1 : 0);

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {post.user.avatarKey ? (
              <Image
                source={getAssetImage(post.user.avatarKey)}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarEmoji}>{post.user.avatar}</Text>
            )}
            <View style={styles.onlineIndicator} />
          </View>

          {/* User Info */}
          <View>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              {post.user.verified && (
                <Ionicons name="checkmark-circle" size={14} color="#3B82F6" />
              )}
            </View>
            <Text style={styles.postTime}>
              Posted a track • {post.postTime}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Track Card */}
      <View style={styles.trackCard}>
        {post.track.artworkKey ? (
          <Image
            source={getAssetImage(post.track.artworkKey)}
            style={styles.trackArtworkImage}
          />
        ) : (
          <View
            style={[
              styles.trackArtwork,
              { backgroundColor: post.track.artworkColor },
            ]}
          >
            <Text style={styles.artworkEmoji}>{post.track.artwork}</Text>
          </View>
        )}

        <View style={styles.trackInfo}>
          <View>
            <Text style={styles.trackTitle}>{post.track.title}</Text>
            <Text style={styles.trackArtist}>{post.track.artist}</Text>
          </View>

          <View style={styles.trackMeta}>
            <View style={styles.playsContainer}>
              <Ionicons name="play" size={12} color="#FFF" />
              <Text style={styles.trackMetaText}>{post.track.plays}</Text>
            </View>
            <Text style={styles.trackMetaText}>• {post.track.duration}</Text>
          </View>
        </View>
      </View>

      {/* Engagement */}
      <View style={styles.engagementBar}>
        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color={liked ? "#EF4444" : "#6B7280"}
          />
          <Text style={styles.engagementText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => onExpandComments(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
          <Text style={styles.engagementText}>
            {post.engagement.comments}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==========================================================
// COMPONENT: CommentSection
// ==========================================================
function CommentSection({
  post,
  onClose,
}: {
  post: FeedPostData;
  onClose: () => void;
}) {
  const [commentText, setCommentText] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.commentSection}>
        {/* Header */}
        <View style={styles.commentHeader}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Feed</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.miniTrackContainer}>
            {/* Avatar mini */}
            <View style={styles.avatarContainer}>
              {post.user.avatarKey ? (
                <Image
                  source={getAssetImage(post.user.avatarKey)}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarEmoji}>{post.user.avatar}</Text>
              )}
              <View style={styles.onlineIndicator} />
            </View>

            <View>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{post.user.name}</Text>
                {post.user.verified && (
                  <Ionicons name="checkmark-circle" size={12} color="#3B82F6" />
                )}
              </View>
              <Text style={styles.postTime}>
                Posted a track • {post.postTime}
              </Text>
            </View>
          </View>

          {/* Artwork mini */}
          {post.track.artworkKey ? (
            <Image
              source={getAssetImage(post.track.artworkKey)}
              style={styles.miniArtworkImage}
            />
          ) : (
            <View
              style={[
                styles.miniArtwork,
                { backgroundColor: post.track.artworkColor },
              ]}
            >
              <Text style={styles.miniArtworkEmoji}>{post.track.artwork}</Text>
            </View>
          )}
        </View>

        {/* Comments */}
        <TouchableOpacity style={styles.commentsCountButton}>
          <Text style={styles.commentsCountText}>
            {post.engagement.comments} comments
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.commentsList}>
          {post.comments?.map((comment) => (
            <View
              key={comment.id}
              style={[styles.commentItem, comment.reply && styles.commentReply]}
            >
              <View style={styles.commentAvatar}>
                {comment.avatarKey ? (
                  <Image
                    source={getAssetImage(comment.avatarKey)}
                    style={styles.commentAvatarImage}
                  />
                ) : (
                  <Text style={styles.commentAvatarEmoji}>
                    {comment.avatar}
                  </Text>
                )}
              </View>

              <View style={styles.commentContent}>
                <View style={styles.commentUserRow}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  {comment.reply && (
                    <Text style={styles.mentionText}>@Jason Smith</Text>
                  )}
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>

                <View style={styles.commentActions}>
                  <Text style={styles.commentMeta}>{comment.time}</Text>
                  <Text style={styles.commentMeta}>
                    {comment.likes} like{comment.likes !== 1 ? "s" : ""}
                  </Text>
                  <Text style={styles.replyButton}>Reply</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.likeButton}>
                <Ionicons name="thumbs-up-outline" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View 10 more replies</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Input comment */}
      <View style={styles.commentInputContainer}>
        <View style={styles.userAvatarInput}>
          <Text style={styles.userAvatarInputText}>H</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity>
            <Ionicons name="send" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==========================================================
// COMPONENT: FeedScreen (Chính)
// ==========================================================
export default function FeedScreen() {
  const [feedData, setFeedData] = useState<FeedPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<FeedPostData | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/feed`);
        const data = await res.json();
        setFeedData(data);
      } catch (error) {
        console.error("Lỗi khi tải feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const handleExpandComments = (postId: string) => {
    const post = feedData.find((p) => p.id === postId);
    setExpandedPost(post || null);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  if (expandedPost) {
    return (
      <CommentSection post={expandedPost} onClose={() => setExpandedPost(null)} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.feedContent}>
        {feedData.map((post) => (
          <FeedPost key={post.id} post={post} onExpandComments={handleExpandComments} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================================
// ✅ Styles
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  feedContent: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: "#FFF",
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#93C5FD",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  postTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  trackCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 4,
  },
  trackArtworkImage: {
    height: 220,
    width: "100%",
  },
  trackArtwork: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkEmoji: {
    fontSize: 80,
  },
  trackInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  trackArtist: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
    marginTop: 2,
  },
  trackMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trackMetaText: {
    fontSize: 14,
    color: "#FFF",
  },
  engagementBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  engagementButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  engagementText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  // Comment section
  commentSection: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  commentHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  miniTrackContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  miniArtworkImage: {
    height: 120,
    borderRadius: 12,
    width: "100%",
  },
  miniArtwork: {
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  miniArtworkEmoji: {
    fontSize: 48,
  },
  commentsCountButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  commentsCountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  commentReply: {
    marginLeft: 32,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#93C5FD",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentAvatarEmoji: {
    fontSize: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  mentionText: {
    fontSize: 12,
    color: "#3B82F6",
  },
  commentText: {
    fontSize: 14,
    color: "#1F2937",
    marginTop: 4,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  commentMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  replyButton: {
    fontSize: 12,
    color: "#6B7280",
  },
  likeButton: {
    padding: 4,
  },
  viewMoreButton: {
    marginLeft: 48,
    marginBottom: 24,
  },
  viewMoreText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  userAvatarInput: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#06B6D4",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarInputText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
});
