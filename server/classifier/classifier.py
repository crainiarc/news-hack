from sets import Set
import json, sys, subprocess, glob, math, datetime, os

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

keywords_asia = Set([])
keywords_trending = Set([])
keywords_scitech = Set([])
keywords_game = Set([])
keywords_entertainment = Set([])
keywords_biz = Set([])
keywords_sports = Set([])
keywords_others = Set([])

keywords_bucket = []
keywords_bucket.append(keywords_asia)
keywords_bucket.append(keywords_trending)
keywords_bucket.append(keywords_scitech)
keywords_bucket.append(keywords_game)
keywords_bucket.append(keywords_entertainment)
keywords_bucket.append(keywords_biz)
keywords_bucket.append(keywords_sports)
keywords_bucket.append(keywords_others)

num_buckets = len(keywords_bucket)
posts = {}
text = {}

def get_keywords_from_file():
	with open("asia.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_asia.add(line.lower())
			line = f.readline()

	with open("trending.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_trending.add(line.lower())
			line = f.readline()

	with open("scitech.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_scitech.add(line.lower())
			line = f.readline()

	with open("game.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_game.add(line.lower())
			line = f.readline()

	with open("entertainment.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_entertainment.add(line.lower())
			line = f.readline()

	with open("biz.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_biz.add(line.lower())
			line = f.readline()

	with open("sports.txt", 'r') as f:
		line = f.readline()
		while line != "":
			line = line.rstrip('\n')
			keywords_sports.add(line.lower())
			line = f.readline()

def classify(filename):
	global posts, text_data
	seen_text = Set([])

	# Set up buckets
	buckets = {}
	for i in range(0, num_buckets):
		buckets[i] = []

	with open(filename, 'r') as f:
		jsonobj = json.load(f)
		
		for key in jsonobj:
			# Set up counter
			bucket_count = []
			for i in range(0, num_buckets):
				bucket_count.append(0)

			obj = jsonobj[key]
			obj_id = obj["id"]
			
			# Extract text from post
			msg, comments, name, desc = "", "", "", ""
			if "message" in obj:
				msg = clean(obj["message"]) + " "
			if "name" in obj:
				name = clean(obj["name"]) + " "
			if "description" in obj:
				desc = clean(obj["description"]) + " "
			text_data = msg + name + desc
			text_data = text_data.lower()

			# Capture post
			if (len(text_data) == 0
				or text_data in seen_text
				or "photo" in text_data):
				continue
			posts[obj_id] = obj
			text[obj_id] = text_data
			seen_text.add(text_data)
		
			# Assign post to bucket
			if "birthday" in text_data or "bday" in text_data:
				# "updated_time":"2015-02-07T14:56:17+0000"
				date_string = obj["updated_time"]
				time_stamp = int(datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S+0000').strftime('%s'))
				buckets[num_buckets-1].append([obj_id, time_stamp, len(text_data), time_stamp])
			else:
				# Add to 'trending' if shared/liked a lot.
				num_shares = 0
				if "shares" in obj:
					num_shares = obj["shares"]["count"]
					if num_shares > 1000:
						num_shares = 0
				num_likes = 0
				if "likes" in obj:
					num_likes = len(obj["likes"]["data"])
				larger_num = max(num_shares, num_likes)
				buckets[1].append([obj_id, float(larger_num)/len(text_data), len(text_data), larger_num])

				# Count keywords and add to buckets
				for i in range(0, num_buckets):
					for w in keywords_bucket[i]:
						if w in text_data:
							bucket_count[i] += 1
					buckets[i].append([obj_id, float(bucket_count[i])/len(text_data), len(text_data), bucket_count[i]])
				
	# Sort importance
	# Items are [post id, ratio/score, length of text_data, max count]
	for i in range(0, num_buckets):
		buckets[i] = sorted(buckets[i], key=lambda x: x[1], reverse=True)

	return buckets

def run_cmd(cmd):
	print cmd
	subprocess.call(cmd)

def clean(s):
	return s.encode('ascii','ignore').replace('\n','').replace('\r','').replace('"',"").replace("'","")

def main(filename):
	get_keywords_from_file()
	buckets = classify(filename)
	# Print top 5 posts in each bucket
	tag = ['asia', 'trending', 'sci & tech', 'game', 'entertainment', 'business', 'sports', 'others']
	for i in range(0, num_buckets):
		print "============"
		print "Bucket " + str(i) + " [" + tag[i].upper() + "]"
		print "============"
		top5 = buckets[i][0:5]
		for x in top5:
			post_id = x[0]
			print x
			print text[post_id]
			print "---------------------"

	return [buckets, posts]

# python cheat.py <input filename>
# Argument List: ['cheat.py', <input filename>]
main(sys.argv[1])
